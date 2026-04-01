package com.financetracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.core.convert.converter.Converter;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
            // LocalDate → Date
            (Converter<LocalDate, Date>) source ->
                Date.from(source.atStartOfDay(ZoneId.systemDefault()).toInstant()),
            // Date → LocalDate
            (Converter<Date, LocalDate>) source ->
                source.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
        ));
    }
}
